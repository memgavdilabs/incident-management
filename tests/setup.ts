/**
 * This is necessary, because it isn't possible to programmatically detect that
 * the preset ts-jest is used and we've to know whether we need to look for .ts or .js files
 */
module.exports = async () => {
  process.env.CDS_TYPESCRIPT = "true";
};
