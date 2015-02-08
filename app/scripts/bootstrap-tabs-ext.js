(function($) {
    'use strict';

    var TAB_ID_PREFIX = 'tab';

    function Tabs(element) {
        this.$ul = $(element);
        // TODO check for tab content based on href of existing tabs
        this.$container = $('.tab-content');

        this.listen();
    }

    Tabs.prototype.addTab = function(id, title, content) {
        var tabId = TAB_ID_PREFIX + id,
            listItem = $('<li />'),
            tabLink = $('<a />', {
                'href': '#' + tabId,
                'class': 'tab'
            }).html($('<button />', {
                'type': 'button',
                'class': 'close closeTab'
            }).text('×')).append(title);

        listItem.append(tabLink);

        var $content;
        if (typeof content === 'string') {
            $content = $('<div />', {
                'id': tabId,
                'class': ['tab-pane']
            });
        } else {
            $content = $(content);
            $content.attr('id', tabId);
            $content.removeClass('hidden');
        }

        this.$ul.append(listItem);
        this.$container.append($content);

        tabLink.tab('show');
    };

    Tabs.prototype.listen = function() {
        var self = this;

        // whenever a tab is clicked this method will be called
        this.$ul.on('click', 'a.tab', function (e) {
            if (e.target.tagName.toLowerCase() !== 'a') return;

            var tabContentId = $(this).attr('href'),
                tabId = getOriginalTabId(tabContentId);

            var beforeSwitchEvent = jQuery.Event('tabs.beforeTabSwitch');
            self.$ul.trigger(beforeSwitchEvent, [tabId]);

            if (!beforeSwitchEvent.isDefaultPrevented()) {
                $(this).tab('show');

                var afterSwitchEvent = jQuery.Event('tabs.afterTabSwitch');
                self.$ul.trigger(afterSwitchEvent, [tabId]);
            }
        });

        // whenever a close tab button is clicked this method will be called
        this.$ul.on('click', '.closeTab', function(e) {
            var closingTab = $(this).parent(),
                tabContentId = closingTab.attr('href'),
                tabId = getOriginalTabId(tabContentId);

            var beforeCloseEvent = jQuery.Event('tabs.beforeTabClose');
            self.$ul.trigger(beforeCloseEvent, [tabId]);

            if (!beforeCloseEvent.isDefaultPrevented()) {
                closingTab.parent().remove(); // remove li of tab
                $(tabContentId).remove(); //remove respective tab content

                var lastTab = self.$ul.find('a.tab:last'),
                    lastTabId = getOriginalTabId(lastTab.attr('href'));
                lastTab.tab('show'); // select last tab

                var afterCloseEvent = jQuery.Event('tabs.afterTabClose');
                self.$ul.trigger(afterCloseEvent, [lastTabId]);
            }
        });
    };

    function getOriginalTabId(tabId) {
        return tabId.slice(TAB_ID_PREFIX.length + 1);
    }

    $.fn.tabs = function() {
        return new Tabs(this);
    };


})(window.jQuery);
