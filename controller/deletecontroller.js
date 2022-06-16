var placedb = require('../models/upload')

exports.delete = (req, res) => {
    const package_id = req.params.id;

    placedb.findOneAndDelete({
            package_id
        })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot Delete with id ${package_id}. Maybe id is wrong`
                })
            } else {
                res.send({
                    message: "Package was deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete the package"
            })
        })
}