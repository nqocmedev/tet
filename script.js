'use strict';

/**
 * NOVA PANEL — Dashboard interactions
 * Vanilla JS, không phụ thuộc thư viện ngoài.
 * Cấu trúc: mỗi tính năng là 1 module nhỏ, khởi tạo trong initApp().
 */

/* ==========================================================================
   MODULE: Mobile sidebar (drawer)
   ========================================================================== */
function initMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const openBtn = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('sidebarClose');

  if (!sidebar || !overlay || !openBtn || !closeBtn) return;

  function openSidebar() {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-visible');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openSidebar);
  closeBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  // Đóng drawer khi chọn 1 mục menu (trên mobile)
  sidebar.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 860) closeSidebar();
    });
  });

  // Đóng khi resize lên desktop để tránh kẹt trạng thái "is-open"
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) closeSidebar();
  });

  // Đóng bằng phím Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
      closeSidebar();
    }
  });
}

/* ==========================================================================
   MODULE: Active nav link (đánh dấu mục đang chọn)
   ========================================================================== */
function initNavActiveState() {
  const links = document.querySelectorAll('.nav__link');
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      // Trong bản demo tĩnh, chặn điều hướng thật và chỉ đổi trạng thái active
      e.preventDefault();
      links.forEach(function (l) { l.classList.remove('nav__link--active'); });
      link.classList.add('nav__link--active');
    });
  });
}

/* ==========================================================================
   MODULE: Order form — tính giá động theo dịch vụ & số lượng
   ========================================================================== */
function initOrderForm() {
  const serviceSelect = document.getElementById('service');
  const quantityInput = document.getElementById('quantity');
  const linkInput = document.getElementById('link');
  const form = document.getElementById('orderForm');

  const unitPriceEl = document.getElementById('unitPrice');
  const summaryUnitPriceEl = document.getElementById('summaryUnitPrice');
  const summaryQtyEl = document.getElementById('summaryQty');
  const summaryTotalEl = document.getElementById('summaryTotal');
  const qtyHelperEl = document.getElementById('qtyHelper');

  if (!serviceSelect || !quantityInput || !form) return;

  const formatVND = new Intl.NumberFormat('vi-VN');

  function getSelectedPrice() {
    const opt = serviceSelect.options[serviceSelect.selectedIndex];
    const price = opt ? Number(opt.dataset.price) : 0;
    return Number.isFinite(price) ? price : 0;
  }

  function calculateTotal(unitPricePer1000, quantity) {
    if (!quantity || quantity <= 0) return 0;
    return Math.round((unitPricePer1000 / 1000) * quantity);
  }

  function updateSummary() {
    const price = getSelectedPrice();
    const qty = Number(quantityInput.value) || 0;
    const total = calculateTotal(price, qty);

    if (unitPriceEl) unitPriceEl.innerHTML = formatVND.format(price) + ' ₫<span>/1000</span>';
    if (summaryUnitPriceEl) summaryUnitPriceEl.textContent = formatVND.format(price) + ' ₫ / 1000';
    if (summaryQtyEl) summaryQtyEl.textContent = formatVND.format(qty);
    if (summaryTotalEl) summaryTotalEl.textContent = formatVND.format(total) + ' ₫';
  }

  function validateQuantity() {
    const min = Number(quantityInput.min) || 0;
    const max = Number(quantityInput.max) || Infinity;
    const val = Number(quantityInput.value);

    if (quantityInput.value === '') {
      qtyHelperEl.textContent = 'Nhập từ ' + formatVND.format(min) + ' đến ' + formatVND.format(max);
      qtyHelperEl.classList.remove('field__helper--error');
      quantityInput.setCustomValidity('');
      return;
    }

    if (val < min || val > max) {
      qtyHelperEl.textContent = 'Số lượng phải trong khoảng ' + formatVND.format(min) + ' – ' + formatVND.format(max);
      qtyHelperEl.classList.add('field__helper--error');
      quantityInput.setCustomValidity('Số lượng không hợp lệ');
    } else {
      qtyHelperEl.textContent = 'Nhập từ ' + formatVND.format(min) + ' đến ' + formatVND.format(max);
      qtyHelperEl.classList.remove('field__helper--error');
      quantityInput.setCustomValidity('');
    }
  }

  serviceSelect.addEventListener('change', updateSummary);
  quantityInput.addEventListener('input', function () {
    validateQuantity();
    updateSummary();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const payload = {
      category: document.getElementById('category').value,
      serviceId: serviceSelect.value,
      link: linkInput.value.trim(),
      quantity: Number(quantityInput.value),
      coupon: document.getElementById('couponCode').value.trim(),
      total: calculateTotal(getSelectedPrice(), Number(quantityInput.value))
    };

    // Điểm tích hợp backend: gửi payload này tới endpoint PHP xử lý đơn hàng.
    // Ví dụ: fetch('/api/orders/create.php', { method: 'POST', body: JSON.stringify(payload) })
    console.log('Order payload (demo — chưa kết nối backend):', payload);

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Đang xử lý…</span>';

    window.setTimeout(function () {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
      alert('Đơn hàng đã được ghi nhận (demo). Tổng tiền: ' + formatVND.format(payload.total) + ' ₫');
    }, 700);
  });

  form.addEventListener('reset', function () {
    window.setTimeout(function () {
      updateSummary();
      qtyHelperEl.classList.remove('field__helper--error');
    }, 0);
  });

  // Khởi tạo giá trị ban đầu
  updateSummary();
}

/* ==========================================================================
   INIT
   ========================================================================== */
function initApp() {
  initMobileSidebar();
  initNavActiveState();
  initOrderForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
