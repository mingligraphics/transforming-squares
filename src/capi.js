// docs: https://github.dowjones.net/newsroom-innovation/capi-generator
const { CapiGenerator, Image } = require('capi-generator');

module.exports = async function () {
  const cg = new CapiGenerator();

  const image = new Image({
    photoUrl: 'https://www.wsj.com/ai2html/bcf17aff-bfff-4b8f-baad-f47e9a02c030/fallback_classic.jpg',
    width: 600,
    height: 1358,
    alternate_text: '',
    credit: '',
    caption: '',
  });
  cg.addToBody(image);

  return cg;
};
