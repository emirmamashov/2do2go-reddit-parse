let _ = require('underscore');

module.exports = {
	sort(pageDatas, sortField, desc) {
		let sortData = [];
		if (sortField === 'score') {
			sortData = _.sortBy(pageDatas, 'score');
		} else if (sortField === 'created_utc') {
			sortData = _.sortBy(pageDatas, 'created_utc');
		}

		if (desc) {
				sortData = sortData.reverse();
		}

		return sortData;
	},
	sqlString(sortData) {
		let resString = '';
		sortData.map((page) => {
				resString += 'db.pages.insert({id: "'+page.id+'",'+ 
				'title: "'+page.title.replace(/"/g,'')+'",'+ 
				'created_utc: "'+page.created_utc+'",'+ 
				'score: '+page.score+'});\n';
		});
		return resString;
	},
	csvData(sortData) {
		let csvRes = [];
		sortData.map((page) => {
				csvRes.push([page.id, page.title, page.created_utc, page.score]);
		});
		return csvRes;
	},
	dataFormat(pages) {
		let pageDatas = [];
		if (pages && pages.length > 0) pages.map((page) => {
			pageDatas.push({id: page.data.id, domain: page.data.domain, title: page.data.title, created_utc: new Date(page.data.created_utc), score: page.data.score});
		});
		return pageDatas;
	},

	agr(pages) {
		let pagesGroupByDomain = _.groupBy(pages, 'domain');
		let agrData = [];
		for (idx in pagesGroupByDomain) {
			let scoreSum = 0;
			pagesGroupByDomain[idx].map((page) => {
				scoreSum += page.score;
			});
			agrData.push([idx, pagesGroupByDomain[idx].length, scoreSum]);
		}
		return agrData;
	}
}