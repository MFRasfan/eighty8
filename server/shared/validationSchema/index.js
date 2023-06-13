const validateSchema = (data, schema) => {
    const { error,values } = schema.validate(data);
    console.log("error,values", error,values)
    if (error) {
        console.log(1)
        res.status(400).json({ message: error.details[0].message });
    }
    return values;
  };
  
  module.exports= validateSchema