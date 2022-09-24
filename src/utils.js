function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function sumAttr(array, attr) {
    return array.reduce((currentTotal, currentObj) => currentObj[attr] + currentTotal, 0)
}

function sum(array) {
    return array.reduce((currentTotal, currentItem) => currentTotal + currentItem, 0)
}

function getCitiesInRange(cityDistribution, minCities, maxCities) {
    return cityDistribution.filter(city => city >= minCities && city <= maxCities).length
}

const count = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

const maximum = arr => {
    return arr.reduce((currentMax, currentValue) => currentValue > currentMax ? currentValue : currentMax, 0)
}

const getRandomColor = () => {
    return Math.floor(Math.random()*16777215).toString(16);
}

const getColor = (seed) => {
    const colors = ["#fcba03", "#4287f5", "#eb4034", "#09827a", "#9936e0", "#d4691e", "#16c740", "#0210b8", "#f43cfa", "#05e1fa"]
    return colors[seed % colors.length]
}

const tierRanges = [[1,10], [11,12], [13,14], [15,16], [17,18], [19,20], [21,23], [24,26], [27,30], [31,34], [35,39], [40,44], [45,100]]
 

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const getGradientColor = (currentValue, maxValue, startColor = [170,0,40], endColor = [0, 170, 40]) => {
    const progress = currentValue / maxValue;
    const calculateProgress = index => (endColor[index] - startColor[index]) * progress + startColor[index]
    return rgbToHex(Math.round(calculateProgress(0)), Math.round(calculateProgress(1)), Math.round(calculateProgress(2)))

}

export { onlyUnique, sumAttr, sum, getCitiesInRange, count, getRandomColor, maximum, getColor, tierRanges, getGradientColor };