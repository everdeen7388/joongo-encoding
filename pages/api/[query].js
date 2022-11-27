const iconv = require('iconv-lite');

const joongUrl = "http://cafe.naver.com/joonggonara.cafe?iframe_url=/ArticleSearchList.nhn%3Fsearch.clubid=10050146%26search.searchBy=0%26search.query=";

export default (req, res) => {
    const utf8Query = req.query['query']
    const euckrQuery = utf8Query && escape(iconv.encode(utf8Query, 'EUC-KR').toString('binary'))
    const url = joongUrl + encodeURIComponent(euckrQuery)
    res.redirect(url)
}

