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
  const body = document.createElement('span');
  // 备用邮箱要可点可抄：文案中的邮箱渲染为 mailto（字符串本体不变）
  const EMAIL_IN_TEXT = /([\w.+-]+@[\w-]+\.[\w.]+)/;
  const match = message.match(EMAIL_IN_TEXT);
  if (match) {
    const [before, after] = message.split(match[1]);
    body.append(before);
    const link = document.createElement('a');
    link.href = `mailto:${match[1]}`;
    link.textContent = match[1];
    body.append(link, after ?? '');
  } else {
    body.textContent = message;
  }
  toast.append(body);

  const dismiss = () => {
    toast.classList.remove('visible');
    window.setTimeout(() => toast.remove(), 250);
  };
  if (kind === 'error') {
    // 失败提示常驻（唯一自救出口，不限时阅读），手动关闭
    const close = document.createElement('button');
    close.className = 'toast-close';
    close.setAttribute('aria-label', 'Dismiss');
    close.innerHTML = '<span aria-hidden="true">+</span>';
    close.addEventListener('click', dismiss);
    toast.append(close);
  } else {
    window.setTimeout(dismiss, 6500);
  }
  requestAnimationFrame(() => toast.classList.add('visible'));
}

function fieldWrap(control: Control): HTMLElement | null {
  return control.closest<HTMLElement>('[data-field]');
}

function setError(wrap: HTMLElement | null, message: string, control?: Control) {
  if (!wrap) return;
  const slot = wrap.querySelector<HTMLElement>('.field-error');
  if (slot) slot.textContent = message;
  wrap.classList.toggle('invalid', Boolean(message));
  // 读屏可达：错误文案与控件建立 ARIA 关联
  if (control && slot) {
    if (message) {
      control.setAttribute('aria-invalid', 'true');
      if (slot.id) control.setAttribute('aria-describedby', slot.id);
    } else {
      control.removeAttribute('aria-invalid');
      control.removeAttribute('aria-describedby');
    }
  }
}

function isHidden(element: HTMLElement): boolean {
  return element.closest('.field-hidden') !== null;
}

function validateControl(control: Control): string {
  const wrap = fieldWrap(control);
  if (wrap && isHidden(wrap)) return '';
  const value = control.value.trim();

  if (control.hasAttribute('required') && !value) {
    // 开窗即红是惩罚性反馈：必填空缺只在"动过这个字段"或"尝试过提交"后呈现（格式错误仍失焦即报）
    const touched = control.dataset.dirty === '1' || control.form?.dataset.submitAttempted === '1';
    return touched ? formMessages.errors.required : '';
  }
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

export function wireForm(form: HTMLFormElement, options?: { onSuccess?: () => void; successPanel?: HTMLElement | null }) {
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

  // 禁用态点击反馈：disabled 按钮吞事件，经包裹层接住 → 指向未勾选的 consent
  submit.closest('.submit-wrap')?.addEventListener('click', () => {
    if (!submit.disabled || !consent || consent.checked) return;
    const row = fieldWrap(consent as unknown as Control);
    row?.classList.remove('nudge');
    void row?.offsetWidth;
    row?.classList.add('nudge');
    consent.focus();
  });

  // 失焦即校验；error 槽预置 id 供 aria-describedby 指向
  controls.forEach((control, index) => {
    const slot = fieldWrap(control)?.querySelector<HTMLElement>('.field-error');
    if (slot && !slot.id) slot.id = `${form.id}-err-${control.name || index}`;
    control.addEventListener('blur', () => setError(fieldWrap(control), validateControl(control), control));
    control.addEventListener('input', () => {
      control.dataset.dirty = '1';
      const wrap = fieldWrap(control);
      if (wrap?.classList.contains('invalid')) setError(wrap, validateControl(control), control);
    });
  });

  // select：空值态同步 + 自绘 combobox 增强（原生保留做数据载体/无 JS 回退）
  form.querySelectorAll<HTMLSelectElement>('select').forEach((select) => {
    const sync = () => select.classList.toggle('is-empty', !select.value);
    select.addEventListener('change', sync);
    sync();
    enhanceSelect(select);
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
      setError(fieldWrap(control), message, control);
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
    form.dataset.submitAttempted = '1';
    if (submitting || !validateAll()) return;

    submitting = true;
    syncSubmitState();
    submit.setAttribute('data-loading', '');
    submitLabel.textContent = formMessages.submitting;

    try {
      const response = await fetch(form.dataset.endpoint ?? form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      if (!response.ok) {
        // 服务端邮箱三层验证拒绝：落回邮箱字段错误，指引比笼统失败更准确
        const detail = (await response.json().catch(() => null)) as { error?: string } | null;
        if (detail?.error?.startsWith('email_')) {
          const emailControl = form.querySelector<Control>('input[name="email"]');
          if (emailControl) {
            setError(fieldWrap(emailControl), formMessages.errors.email, emailControl);
            emailControl.focus();
            return; // 不弹失败 toast（这不是系统故障）
          }
        }
        throw new Error(`HTTP ${response.status}`);
      }
      showToast(formMessages.toasts.success, 'success');
      form.reset();
      form.querySelectorAll<HTMLTextAreaElement>('textarea[data-maxlength]').forEach((area) =>
        area.dispatchEvent(new Event('input'))
      );
      syncConditionals();
      if (options?.successPanel) {
        form.hidden = true;
        options.successPanel.hidden = false;
        form.parentElement?.classList.add('form-succeeded'); // 隐去 intro 等仅与填写态相关的元素
      }
      if (options?.onSuccess) {
        // reduced-motion：立即执行，不做展示性等待
        const wait = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450;
        window.setTimeout(options.onSuccess, wait);
      }
    } catch {
      // 失败保留表单内容，toast 附带用户可自救的备用邮箱
      showToast(formMessages.toasts.failure, 'error');
    } finally {
      submitting = false;
      submit.removeAttribute('data-loading');
      submitLabel.textContent = idleLabel;
      syncSubmitState();
    }
  });
}


// —— 自绘下拉（ARIA combobox + listbox）：展开选单脱离系统菜单，与全站控件同语言 ——
// 原生 <select> 保留在 DOM（display:none）：表单序列化、无 JS 回退、既有校验/条件显隐全部照常
function enhanceSelect(select: HTMLSelectElement) {
  if (select.dataset.enhanced === '1') return;
  select.dataset.enhanced = '1';

  const wrap = select.closest<HTMLElement>('[data-field]');
  const labelText = wrap ? (wrap.childNodes[0]?.textContent ?? '').trim() : select.name;

  const shell = document.createElement('div');
  shell.className = 'select-shell';
  select.parentNode?.insertBefore(shell, select);
  shell.append(select);
  select.classList.add('select-native');

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'select-trigger';
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-label', labelText);
  const valueSpan = document.createElement('span');
  valueSpan.className = 'select-value';
  trigger.append(valueSpan);
  shell.append(trigger);

  const list = document.createElement('ul');
  list.className = 'select-list';
  list.setAttribute('role', 'listbox');
  list.id = `${select.form?.id ?? 'f'}-${select.name}-listbox`;
  trigger.setAttribute('aria-controls', list.id);
  shell.append(list);

  const options = [...select.options].map((opt, index) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.id = `${list.id}-${index}`;
    li.dataset.value = opt.value;
    li.textContent = opt.text;
    if (!opt.value) li.classList.add('is-placeholder');
    list.append(li);
    return li;
  });

  let activeIndex = Math.max(0, select.selectedIndex);
  let typeahead = '';
  let typeaheadTimer = 0;

  const render = () => {
    const current = select.options[select.selectedIndex];
    valueSpan.textContent = current ? current.text : '';
    trigger.classList.toggle('is-empty', !select.value);
    options.forEach((li, index) => {
      li.setAttribute('aria-selected', String(index === select.selectedIndex));
    });
  };

  const setActive = (index: number) => {
    activeIndex = Math.min(options.length - 1, Math.max(0, index));
    options.forEach((li, k) => li.classList.toggle('is-active', k === activeIndex));
    trigger.setAttribute('aria-activedescendant', options[activeIndex].id);
    options[activeIndex].scrollIntoView({ block: 'nearest' });
  };

  const open = () => {
    if (shell.classList.contains('open')) return;
    shell.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    // 视口下缘空间不足时向上展开
    const rect = trigger.getBoundingClientRect();
    shell.classList.toggle('up', window.innerHeight - rect.bottom < 300 && rect.top > 300);
    setActive(Math.max(0, select.selectedIndex));
  };

  const close = (refocus = false) => {
    if (!shell.classList.contains('open')) return;
    shell.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
    if (refocus) trigger.focus();
  };

  const commit = (index: number) => {
    select.selectedIndex = index;
    select.dataset.dirty = '1';
    render();
    close(true);
    select.dispatchEvent(new Event('change', { bubbles: true }));
    select.dispatchEvent(new Event('blur'));
  };

  trigger.addEventListener('click', () => (shell.classList.contains('open') ? close() : open()));
  trigger.addEventListener('keydown', (event) => {
    const isOpen = shell.classList.contains('open');
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) open();
      else setActive(activeIndex + (event.key === 'ArrowDown' ? 1 : -1));
    } else if (event.key === 'Home' && isOpen) {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End' && isOpen) {
      event.preventDefault();
      setActive(options.length - 1);
    } else if ((event.key === 'Enter' || event.key === ' ') && !isOpen) {
      event.preventDefault();
      open();
    } else if (event.key === 'Enter' && isOpen) {
      event.preventDefault();
      commit(activeIndex);
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    } else if (event.key.length === 1 && /\S/.test(event.key)) {
      // 类型检索（对 199 国列表尤其重要）
      if (!isOpen) open();
      window.clearTimeout(typeaheadTimer);
      typeahead += event.key.toLowerCase();
      typeaheadTimer = window.setTimeout(() => (typeahead = ''), 500);
      const hit = options.findIndex((li) => li.textContent!.toLowerCase().startsWith(typeahead));
      if (hit >= 0) setActive(hit);
    } else if (event.key === 'Tab') {
      close();
    }
  });
  list.addEventListener('mousedown', (event) => event.preventDefault()); // 防 trigger 失焦闪烁
  options.forEach((li, index) => li.addEventListener('click', () => commit(index)));
  document.addEventListener('click', (event) => {
    if (!shell.contains(event.target as Node)) close();
  });
  trigger.addEventListener('blur', () => {
    // 焦点离开触发器时延迟收起（点击选项经 mousedown 阻断，不受影响）
    window.setTimeout(() => {
      if (!shell.contains(document.activeElement)) close();
    }, 0);
  });

  render();
}
