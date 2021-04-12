document.addEventListener("DOMContentLoaded", //)
	function(){
		var global_title = 'Заметки';
		var global_description = 'Записи о разном';
		var global_author = 'Алексей Шпаковский';
		var selectors = {
			".":{
				'global_title':'#title h1 a',
				'global_description':'#title #description',
				'global_author':'.subtitle',
				'readmore':'p.readmore a',
				'tags_replacer':'p',
				'all_posts':'#all_posts a:nth-of-type(1)',
				'all_tags':'#all_posts a:nth-of-type(2)',
				'subscribe':'#all_posts a:nth-of-type(3)',
			},
			"all_posts.html":{
				'all_posts_title':'h3',
				'back_to_index':'#all_posts a',
			},
			"all_tags.html":{
				'all_tags_title':'h3',
				'all_tags_post_counter':'li',
				'back_to_index':'#all_posts a',
			},
			"index.html":{
			},
			"tag_":{
			},
		};
		var translations={
			'ru':{
				'global_title':global_title,
				'global_description':global_description,
				'global_author':'|(.* — )[^]*|$1'+global_author,
				'readmore':'Читать далее...',
				'tags_replacer':'|^Tags:|Метки:|',
				'all_posts':'Все записи',
				'all_tags':'Все метки',
				'subscribe':'Подписаться',
				'all_posts_title':'Все записи',
				'all_tags_title':'Все метки',
				'all_tags_post_counter':'|(.* — )([0-9]*).*|$1 записей: $2',
				'back_to_index':'Назад',
				'index.html': global_title,
				'all_posts.html': global_title+' – все записи',
				'all_tags.html': global_title+' – все метки',
				'tag_': '|.*"(.*)".*|'+global_title+' – записи с меткой $1',
				'':'',
			},
		};

		var setString=function(obj, prop, value){
			if(value[0]=='|') {
				value=value.split('|');
				obj[prop]=obj[prop].replace(RegExp(value[1]),value[2]);
			} else
				obj[prop]=value;
		}

		var tryLang=function(lang){
			if(!translations[lang])
				return false;
			else {
				for(var url in selectors){
					if(location.href.match(url)){
						for(var name in selectors[url]){
							var elements=document.querySelectorAll(selectors[url][name]);
							for(var i=0; i<elements.length; i++)
								setString(elements[i], 'innerHTML', translations[lang][name]);
						}
						if(translations[lang][url]){
							setString(document, 'title', translations[lang][url]);
						}
					}
				}
				return true;
			}
		};
		if(!tryLang(navigator.language))
			tryLang(navigator.language.slice(0,2));
	}, false);
