var generateErrorResponseJson = (res, errorMessage) => {
	return res.json({ error: { message: errorMessage } });
};

module.exports = {
	generateErrorResponseJson: generateErrorResponseJson,
};
