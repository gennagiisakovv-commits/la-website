(function ($) {
  "use strict";

  var PAGE_SIZE = 4;

  var TYPE_LABELS = {
    handwriting: "На заметку",
    legal: "К размышлению",
    practice: "Статьи",
    lawyer: "Для юриста"
  };

  var BADGE_VARIANTS = ["primary", "secondary", "tertiary"];

  var JOURNAL_ITEMS = window.JOURNAL_ITEMS || [];

  var state = {
    page: 1,
    sortNewest: true,
  };

  var $list;
  var $count;
  var $pagination;
  var $period;
  var $search;
  var $sortBtn;
  var $filters;

  function getBadgeVariant(item, index) {
    if (item.badgeVariant) {
      return item.badgeVariant;
    }
    return BADGE_VARIANTS[index % BADGE_VARIANTS.length];
  }

  function getBadgeLabel(item) {
    if (item.badge) {
      return item.badge;
    }
    return TYPE_LABELS[item.type] || item.type;
  }

  function getSelectedTypes() {
    var $all = $filters.filter('[data-journal-filter="all"]');
    if ($all.is(":checked")) {
      return null;
    }
    var types = $filters
      .not('[data-journal-filter="all"]')
      .filter(":checked")
      .map(function () {
        return $(this).data("journal-filter");
      })
      .get();
    return types.length ? types : null;
  }

  function getSelectedYear() {
    var val = $period.val();
    return val === "all" ? null : parseInt(val, 10);
  }

  function getSearchQuery() {
    return ($search.val() || "").trim().toLowerCase();
  }

  function getItemSearchText(item) {
    var text = item.excerpt || "";
    if (!text && item.excerptHtml) {
      text = String(item.excerptHtml).replace(/<[^>]+>/g, " ");
    }
    return ((item.title || "") + " " + text).toLowerCase();
  }

  function getItemTypes(item) {
    if (item.types && item.types.length) {
      return item.types;
    }
    return [item.type];
  }

  function filterItems() {
    var types = getSelectedTypes();
    var year = getSelectedYear();
    var items = JOURNAL_ITEMS.slice();

    if (types) {
      items = items.filter(function (item) {
        var itemTypes = getItemTypes(item);
        return itemTypes.some(function (t) {
          return types.indexOf(t) !== -1;
        });
      });
    }

    if (year) {
      items = items.filter(function (item) {
        return item.year === year;
      });
    }

    var query = getSearchQuery();
    if (query) {
      items = items.filter(function (item) {
        return getItemSearchText(item).indexOf(query) !== -1;
      });
    }
 
    items.sort(function (a, b) {
      var orderA = a.sortOrder != null ? a.sortOrder : 0;
      var orderB = b.sortOrder != null ? b.sortOrder : 0;
      return state.sortNewest ? orderB - orderA : orderA - orderB;
    });

    return items;
  }

  function pluralMaterials(n) {
    var mod10 = n % 10;
    var mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 14) {
      return "материалов";
    }
    if (mod10 === 1) {
      return "материал";
    }
    if (mod10 >= 2 && mod10 <= 4) {
      return "материала";
    }
    return "материалов";
  }

  function renderCard(item, index) {
    var variant = getBadgeVariant(item, index);
    var badge = getBadgeLabel(item);
    var categoryHtml = item.category
      ? '<span class="journal-card__category">' + escapeHtml(item.category) + "</span>"
      : "";
    var excerptContent = item.excerptHtml || escapeHtml(item.excerpt || "");
    var href = (item.href || "").trim();
    var isExternal = /^https?:\/\//i.test(href);
    var linkAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
    var tag = href ? "a" : "article";
    var hrefAttr = href ? ' href="' + escapeAttr(href) + '"' + linkAttrs : "";

    return (
      "<" +
      tag +
      hrefAttr +
      ' class="journal-card">' +
      '<div class="journal-card__row">' +
      '<div class="journal-card__main">' +
      '<div class="journal-card__meta">' +
      '<span class="journal-card__badge journal-card__badge--' +
      variant +
      '">' +
      escapeHtml(badge) +
      "</span>" +
      categoryHtml +
      "</div>" +
      "<h3 class=\"journal-card__title\">" +
      escapeHtml(item.title) +
      "</h3>" +
      '<p class="journal-card__excerpt">' +
      excerptContent +
      "</p>" +
      "</div>" +
      '<div class="journal-card__actions">' +
      '<button type="button" class="journal-card__bookmark" aria-label="В закладки">' +
      '<span class="material-symbols-outlined">bookmark_add</span>' +
      "</button>" +
      '<span class="material-symbols-outlined journal-card__arrow">arrow_forward</span>' +
      "</div>" +
      "</div>" +
      "</" +
      tag +
      ">"
    );
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  function clampPage(page, totalPages) {
    if (totalPages < 1) {
      return 1;
    }
    return Math.min(Math.max(1, page), totalPages);
  }

  function getPageNumbers(current, total) {
    if (total <= 7) {
      var all = [];
      for (var i = 1; i <= total; i++) {
        all.push(i);
      }
      return all;
    }
    var pages = [1];
    if (current > 3) {
      pages.push("ellipsis");
    }
    var start = Math.max(2, current - 1);
    var end = Math.min(total - 1, current + 1);
    for (var p = start; p <= end; p++) {
      pages.push(p);
    }
    if (current < total - 2) {
      pages.push("ellipsis");
    }
    pages.push(total);
    return pages;
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      $pagination.empty().hide();
      return;
    }

    $pagination.show();
    var current = clampPage(state.page, totalPages);
    var html = "";

    html +=
      '<button type="button" class="journal-pagination__btn journal-pagination__btn--prev" ' +
      (current === 1 ? "disabled" : "") +
      ' aria-label="Предыдущая страница">' +
      '<span class="material-symbols-outlined">chevron_left</span></button>';

    getPageNumbers(current, totalPages).forEach(function (page) {
      if (page === "ellipsis") {
        html += '<span class="journal-pagination__ellipsis">...</span>';
        return;
      }
      html +=
        '<button type="button" class="journal-pagination__btn' +
        (page === current ? " journal-pagination__btn--active" : "") +
        '" data-page="' +
        page +
        '">' +
        page +
        "</button>";
    });

    html +=
      '<button type="button" class="journal-pagination__btn journal-pagination__btn--next" ' +
      (current === totalPages ? "disabled" : "") +
      ' aria-label="Следующая страница">' +
      '<span class="material-symbols-outlined">chevron_right</span></button>';

    $pagination.html(html);
  }

  function render() {
    var filtered = filterItems();
    var total = filtered.length;
    var totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    state.page = clampPage(state.page, totalPages);

    var start = (state.page - 1) * PAGE_SIZE;
    var pageItems = filtered.slice(start, start + PAGE_SIZE);

    if (total === 0) {
      $list.html('<p class="journal-feed__empty">По выбранным фильтрам ничего не найдено.</p>');
    } else {
      $list.html(
        pageItems
          .map(function (item, i) {
            return renderCard(item, start + i);
          })
          .join("")
      );
    }

    $count.text("Показано: " + total + " " + pluralMaterials(total));
    renderPagination(totalPages);
  }

  function onFilterChange(changed) {
    var $changed = $(changed);
    var filter = $changed.data("journal-filter");
    var $all = $filters.filter('[data-journal-filter="all"]');

    if (filter === "all") {
      if ($changed.is(":checked")) {
        $filters.not('[data-journal-filter="all"]').prop("checked", false);
      }
    } else {
      if ($changed.is(":checked")) {
        $all.prop("checked", false);
      } else {
        var anyChecked = $filters.not('[data-journal-filter="all"]').filter(":checked").length;
        if (!anyChecked) {
          $all.prop("checked", true);
        }
      }
    }

    state.page = 1;
    render();
  }

  function init() {
    var $section = $(".journal-section");
    if (!$section.length) {
      return;
    }

    $list = $("#journal-list");
    $count = $("#journal-count");
    $pagination = $("#journal-pagination");
    $period = $("#journal-period");
    $search = $("#journal-search");
    $sortBtn = $("#journal-sort");
    $filters = $section.find("[data-journal-filter]");

    $filters.on("change", function () {
      onFilterChange(this);
    });

    $period.on("change", function () {
      state.page = 1;
      render();
    });

    $search.on("input", function () {
      state.page = 1;
      render();
    });

    $sortBtn.on("click", function () {
      state.sortNewest = !state.sortNewest;
      $(this).toggleClass("journal-feed__sort--asc", !state.sortNewest);
      var label = state.sortNewest ? "Сначала новые" : "Сначала старые";
      $(this).find(".journal-feed__sort-label").text(label);
      state.page = 1;
      render();
    });

    $pagination.on("click", ".journal-pagination__btn[data-page]", function () {
      state.page = parseInt($(this).data("page"), 10);
      render();
      $section[0].scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $pagination.on("click", ".journal-pagination__btn--prev:not(:disabled)", function () {
      state.page -= 1;
      render();
    });

    $pagination.on("click", ".journal-pagination__btn--next:not(:disabled)", function () {
      state.page += 1;
      render();
    });

    $list.on("click", ".journal-card__bookmark", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    render();
  }

  $(document).ready(init);
})(window.jQuery);
