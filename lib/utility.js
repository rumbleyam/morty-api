/**
 * Returns whether the provided input is an alphanumeric 24 length string
 * @param  {String}  string Input to check
 * @return {Boolean}        Whether input is a valid object id
 */
exports.isValidObjectId = (string) => {
	return _.isString(string) && /^[a-fA-F0-9]{24}$/.test(string);
};
