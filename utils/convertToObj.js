function convertToObj(fileBuffer) {
    const [headerLine, ...lines] = fileBuffer;
    const valueSeparator = ',';
    const headers = headerLine.split(valueSeparator);
    const objects = lines
        .map((line, index) =>
            line.split(valueSeparator).reduce(
                (object, value, index) => ({
                    ...object,
                    [headers[index]]: value,
                }),
                {}
            )
        );
    return objects;
}
 
module.exports = convertToObj;