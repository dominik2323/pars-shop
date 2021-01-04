export function genCSV(input: Array<object>, filename: string) {
  const makeRow = (array: Array<string>) => array.join(';') + '\n';

  // get header (= keys) for csv file from keys of the first object in array
  let content = makeRow(Object.keys(input[0]));

  input.forEach((item) => {
    content += makeRow(Object.values(item));
  });

  const buffer = Buffer.from(content);

  return {
    filename,
    content: buffer.toString(`base64`),
    contentType: 'text/csv',
    encoding: `base64`
  };
}
