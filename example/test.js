if (i.bigsrc)
    if (i.big5 && (e = ChineseHelper.convertToTraditionalChinese(e)),
    i.py)
        if ("undefined" != typeof PinyinHelper) {
            var t = PinyinHelper.convertToPinyin(e, PinyinFormat.WITH_TONE_MARK);
            document.getElementById("acctip").textContent = "";
            for (var n = 0; n < t.length; n++) {
                var r = (r = '<div class="pinyin ariaskiptheme">') + ('<ariab class="ariaskiptheme"><ariai class="ariaskiptheme">' + t[n].v + '</ariai><ariai class="ariaskiptheme">' + (i.big5 ? ChineseHelper.convertToTraditionalChinese(t[n].key) : t[n].key) + "</ariai></ariab>") + "</div>";
                new o("#accscreen #acctip").append(r)
            }
        } else
            i.loadPy();
    else
        new o("#accscreen #acctip").html(e)