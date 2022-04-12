var generateSingleLink = (rel, href, action, types) => {
	return {
		rel,
		href,
		action,
		types,
	};
};

var generateMultipleLinks = (
	collectionToBeTurnedIntoLinks,
	modifierToObtainRel,
	modifierToObtainHref,
	modifierToObtainAction,
	modifierToObtainTypes
) => {
	var arrayOfLinks = [];

	collectionToBeTurnedIntoLinks.forEach((element) => {
		var singleLink = generateSingleLink(
			modifierToObtainRel(element),
			modifierToObtainHref(element),
			modifierToObtainAction(element),
			modifierToObtainTypes(element)
		);

		arrayOfLinks.push(singleLink);
	});

	return arrayOfLinks;
};

module.exports = {
	generateSingleLink: generateSingleLink,
	generateMultipleLinks: generateMultipleLinks,
};
