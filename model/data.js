

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
                    // try cast for other types
                } else {
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

module.exports = { validate_request };