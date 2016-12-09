/**
 * 一个使用TypeScript开发的简单分页条，支持首页、末页、上一页、下一页、自定义页码切换。
 * 宇润软件 http://www.yurunsoft.com
 */
class SimplePagebar {
    public container = null;
    public element = null;
    public pages = 0;
    public currPage = 1;
    public showFirst = true;
    public showLast = true;
    public first = '&lt;&lt;';
    public last = '&gt;&gt;';
    public prev = '&lt;';
    public next = '&gt;';
    public onPageChange = null;
    static isFirstLoad = true;
    static currPath = '';
    public constructor(option) {
        for (var key in option) {
            this[key] = option[key];
        }
    }
    public display() {
        if (SimplePagebar.isFirstLoad) {
            var item = $('<link>').attr({ rel: 'stylesheet', type: 'text/css', href: SimplePagebar.currPath + 'SimplePagebar.css' });
            $('head').append(item);
            SimplePagebar.isFirstLoad = false;
        }
        this.element = $(
            '<div class="simple-pagebar">\
            <a class="sp-first"></a>\
            <a class="sp-prev"></a>\
            <input type="text" class="sp-page"/>\
            <a class="sp-next"></a>\
            <a class="sp-last"></a>\
        </div>');
        if (this.showFirst) {
            this.element.find('.sp-first')
                .on('click', () => {
                    this.goto(1);
                    this.setPageShowText();
                })
                .html(this.first);
        }
        else {
            this.element.find('.sp-first').remove();
        }
        if (this.showLast) {
            this.element.find('.sp-last')
                .on('click', () => {
                    this.goto(this.pages);
                    this.setPageShowText();
                })
                .html(this.last);
        }
        else {
            this.element.find('.sp-last').remove();
        }
        this.element.find('.sp-prev')
            .on('click', () => {
                this.goto(Math.max(1, this.currPage - 1));
                this.setPageShowText();
            })
            .html(this.prev);
        this.element.find('.sp-next')
            .on('click', () => {
                this.goto(Math.min(this.pages, this.currPage + 1));
                this.setPageShowText();
            })
            .html(this.next);
        this.container.html('').append(this.element);
        this.element.find('.sp-page')
            .on('focus', (e) => {
                this.setPageShowText();
                $(e.currentTarget).select();
            })
            .on('blur', (e) => {
                var page = parseInt($(e.currentTarget).val());
                if (!isNaN(page)) {
                    this.goto(page);
                }
                this.setPageShowText();
            })
            .on('keydown', (e) => {
                if (e.which == 13) {
                    $(e.currentTarget).blur();
                }
                else if (e.which == 27) {
                    $(e.currentTarget).val(this.currPage);
                    $(e.currentTarget).blur();
                }
            })
            ;
        this.setPageShowText();
    }
    public goto(page) {
        if (page < 0) {
            page = 1;
        }
        else if (page > this.pages) {
            page = this.pages;
        }
        var oldPage = this.currPage;
        this.currPage = page;
        if (this.onPageChange !== null) {
            this.onPageChange({ page: this.currPage, isChanged: oldPage != this.currPage });
        }
    }
    private setPageShowText() {
        var page = this.element.find('.sp-page');
        if (page.is(":focus")) {
            page.val(this.currPage);
        }
        else {
            page.val(this.currPage + " / " + this.pages);
        }
    }
}
/*!
 * referrence:
 * https://github.com/fsjohnhuang/getCurrAbsPath
 */
; (function (exports: any) {
    var doc = exports.document,
        a: any = {},
        expose = +new Date(),
        rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
        isLtIE8 = ('' + doc.querySelector).indexOf('[native code]') === -1;
    function getCurrAbsPath() {
        // FF,Chrome
        if (doc.currentScript) {
            return (<HTMLScriptElement>doc.currentScript).src;
        }

        var stack;
        try {
            a.b();
        }
        catch (e) {
            stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
        }
        // IE10
        if (stack) {
            var absPath = rExtractUri.exec(stack)[1];
            if (absPath) {
                return absPath;
            }
        }

        // IE5-9
        for (var scripts = doc.scripts,
            i = scripts.length - 1,
            script; script = scripts[i--];) {
            if (script.className !== expose && script.readyState === 'interactive') {
                script.className = expose;
                // if less than ie 8, must get abs path by getAttribute(src, 4)
                return isLtIE8 ? script.getAttribute('src', 4) : script.src;
            }
        }
    }
    var arr = getCurrAbsPath().split("/");
    delete arr[arr.length - 1];
    SimplePagebar.currPath = arr.join("/");
} (window));