import db from '../model/mongo';

const mailSchema = db.schema({
    to: String,
    template: String,
    language: String,
    variables: Object,
});

const mailModel = db.model('mail', mailSchema);

export default mailModel;
