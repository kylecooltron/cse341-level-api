

const validate_request = (body, doc_template) => {
    /**
     * Takes request body and validates it against a template.
     * I'm really happy with how this turned out.
     */
    let result = {};
    for (var key in doc_template) {
        if (key in body) {
            try {
                // special casting for Date's
                if (doc_template[key] == Date) {
                    const parsed = Date.parse(body[key]);
                    if (isNaN(parsed)) {
                        throw new Error(parsed);
                    } else {
                        body[key] = new Date(body[key]);
                    }

                } else if (doc_template[key] instanceof ArrayOfTemplate) {
                    // ensure that the body contains an array
                    if (!Array.isArray(body[key])) {
                        throw new Error(`${body[key]} is not an Array as expected`);
                    }
                    // ensure that the elements in the array match the type
                    const array_template = doc_template[key].template;
                    body[key].forEach((item, item_index) => {
                        // recursively call this function on each item in the array
                        const item_result = validate_request(item, array_template);
                        if (!item_result[0]) {
                            return [
                                false,
                                `Failed when validating element in array: ${item}
                                Details: ${item_result[1]}`
                            ]
                        } else {
                            // array item validated - set to result to leave out any extra properties
                            body[key][item_index] = item_result[1];
                        }
                    })
                } else {
                    // try cast for other types
                    doc_template[key](body[key]);
                }
            } catch (e) {
                return [
                    false,
                    `Incorrect data type: ${body[key]} 
                    Was expecting: ${String(doc_template[key]).split(" ")[1]} 
                    Error ${e}`
                ];
            }
            result[key] = body[key];
        } else {
            return [false, `Missing required field ${key}`];
        }
    }
    return [true, result];
}


class ArrayOfTemplate {
    /**
     * type should be a template object
     */
    constructor(template) {
        this.template = template;
    }
}


module.exports = { validate_request, ArrayOfTemplate };