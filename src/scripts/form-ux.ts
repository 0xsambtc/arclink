// 表单交互层 — 行为规格来自 docs/content/requirements-v0.2.md「交互与状态需求」：
// 失焦即校验、错误文案标红、consent 未勾选禁提交、提交中防重复、成功清空/失败保留 + toast
// 结构约定（页面侧）：控件包在 <label data-field> 内且带 <small class="field-error">；
// 多选组用 <fieldset data-field data-required-group>；textarea 用 data-maxlength + .char-count；
// 条件显隐用 [data-visible-if="控件名"]；consent 勾选框带 data-consent；表单带 data-endpoint。
import { formMessages } from '../data/forms';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// 含国际区号的宽松格式 + 位数校验（7–15 位数字）
const PHONE_CHARS_RE = /^\+?[0-9\s().-]+$/;

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function showToast(message: string, kind: 'success' | 'error') {
  let region = document.querySelector<HTMLElement>('.toast-region');
  if (!region) {
    region = document.createElement('div');
    region.className = 'toast-region';
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${kind}`;
  toast.textContent = message;
  region.append(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  window.setTimeout(() => {
    toast.classList.remove('visible');
    window.setTimeout(() => toast.remove(), 400);
  }, 6500);
}

function fieldWrap(control: Control): HTMLElement | null {
  return control.closest<HTMLElement>('[data-field]');
}

function setError(wrap: HTMLElement | null, message: string) {
  if (!wrap) return;
  const slot = wrap.querySelector<HTMLElement>('.field-error');
  if (slot) slot.textContent = message;
  wrap.classList.toggle('invalid', Boolean(message));
}

function isHidden(element: HTMLElement): boolean {
  return element.closest('.field-hidden') !== null;
}

function validateControl(control: Control): string {
  const wrap = fieldWrap(control);
  if (wrap && isHidden(wrap)) return '';
  const value = control.value.trim();

  if (control.hasAttribute('required') && !value) return formMessages.errors.required;
  if (!value) return '';

  if (control instanceof HTMLInputElement && control.type === 'email' && !EMAIL_RE.test(value)) {
    return formMessages.errors.email;
  }
  if (control.dataset.validate === 'phone') {
    const digits = value.replace(/\D/g, '');
    if (!PHONE_CHARS_RE.test(value) || digits.length < 7 || digits.length > 15) {
      return formMessages.errors.phone;
    }
  }
  if (control.dataset.validate === 'email' && !EMAIL_RE.test(value)) {
    return formMessages.errors.email;
  }
  const max = Number(control.dataset.maxlength || 0);
  if (max && value.length > max) return formMessages.errors.maxLength;
  return '';
}

function validateGroup(group: HTMLElement): string {
  if (isHidden(group)) return '';
  if (!group.hasAttribute('data-required-group')) return '';
  const checked = group.querySelectorAll('input:checked').length;
  return checked > 0 ? '' : formMessages.errors.required;
}

export function wireForm(form: HTMLFormElement) {
  const controls = [...form.querySelectorAll<Control>('input, select, textarea')].filter(
    (control) => !(control instanceof HTMLInputElement && ['checkbox', 'hidden'].includes(control.type))
  );
  const groups = [...form.querySelectorAll<HTMLElement>('fieldset[data-field]')];
  const consent = form.querySelector<HTMLInputElement>('input[data-consent]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const submitLabel = submit.querySelector<HTMLElement>('.submit-label') ?? submit;
  const idleLabel = submitLabel.textContent ?? '';
  let submitting = false;

  // consent 门禁：未勾选时提交不可点击（GDPR，不可默认勾选）
  const syncSubmitState = () => {
    submit.disabled = submitting || (consent ? !consent.checked : false);
  };
  consent?.addEventListener('change', () => {
    setError(fieldWrap(consent as unknown as Control), '');
    syncSubmitState();
  });
  syncSubmitState();

  // 失焦即校验
  controls.forEach((control) => {
    control.addEventListener('blur', () => setError(fieldWrap(control), validateControl(control)));
    control.addEventListener('input', () => {
      const wrap = fieldWrap(control);
      if (wrap?.classList.contains('invalid')) setError(wrap, validateControl(control));
    });
  });
  groups.forEach((group) => {
    group.addEventListener('change', () => setError(group, validateGroup(group)));
  });

  // 字符计数（data-maxlength 校验产生规格要求的超限文案，故不用原生 maxlength 截断）
  form.querySelectorAll<HTMLTextAreaElement>('textarea[data-maxlength]').forEach((area) => {
    const counter = fieldWrap(area)?.querySelector<HTMLElement>('.char-count');
    if (!counter) return;
    const update = () => (counter.textContent = `${area.value.length} / ${area.dataset.maxlength}`);
    area.addEventListener('input', update);
    update();
  });

  // 条件显隐：data-visible-if="控件名" → 该控件有值时显示
  const conditionals = [...form.querySelectorAll<HTMLElement>('[data-visible-if]')];
  const syncConditionals = () => {
    conditionals.forEach((element) => {
      const source = form.elements.namedItem(element.dataset.visibleIf ?? '');
      const hasValue =
        source instanceof RadioNodeList
          ? Boolean(source.value)
          : source instanceof HTMLInputElement || source instanceof HTMLSelectElement
            ? Boolean(source.value)
            : false;
      element.classList.toggle('field-hidden', !hasValue);
      if (!hasValue) {
        element.classList.remove('invalid');
        const slot = element.querySelector<HTMLElement>('.field-error');
        if (slot) slot.textContent = '';
      }
    });
  };
  form.addEventListener('change', syncConditionals);
  syncConditionals();

  const validateAll = (): boolean => {
    const invalid: HTMLElement[] = [];
    controls.forEach((control) => {
      const message = validateControl(control);
      setError(fieldWrap(control), message);
      if (message) invalid.push(control);
    });
    groups.forEach((group) => {
      const message = validateGroup(group);
      setError(group, message);
      if (message) invalid.push(group);
    });
    const first = invalid[0];
    if (first) {
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      first.focus({ preventScroll: true });
    }
    return invalid.length === 0;
  };

  const buildPayload = () => {
    const data = new FormData(form);
    const payload: Record<string, unknown> = {};
    for (const [key, value] of data.entries()) {
      if (payload[key] !== undefined) {
        payload[key] = Array.isArray(payload[key]) ? [...(payload[key] as unknown[]), value] : [payload[key], value];
      } else {
        payload[key] = value;
      }
    }
    // 多选组固定输出数组，避免单选时后端拿到字符串
    form.querySelectorAll<HTMLElement>('fieldset[data-field]').forEach((group) => {
      const name = group.dataset.name;
      if (!name) return;
      const values = [...group.querySelectorAll<HTMLInputElement>('input:checked')].map((input) => input.value);
      payload[name] = values;
    });
    return payload;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting || !validateAll()) return;

    submitting = true;
    syncSubmitState();
    submitLabel.textContent = formMessages.submitting;

    try {
      const response = await fetch(form.dataset.endpoint ?? form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      showToast(formMessages.toasts.success, 'success');
      form.reset();
      form.querySelectorAll<HTMLTextAreaElement>('textarea[data-maxlength]').forEach((area) =>
        area.dispatchEvent(new Event('input'))
      );
      syncConditionals();
    } catch {
      // 失败保留表单内容，toast 附带用户可自救的备用邮箱
      showToast(formMessages.toasts.failure, 'error');
    } finally {
      submitting = false;
      submitLabel.textContent = idleLabel;
      syncSubmitState();
    }
  });
}
