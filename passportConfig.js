const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user')
// const conn = require('./dbConfig');
const bcrypt = require('bcryptjs');

function initialize(passport) {
    const authenticateUser = async (uname, password, done) => {

        // conn.query(`SELECT * FROM users WHERE email = $1`, [uname], (err, results) => {
        //     if (err) {
        //         throw err;
        //     }
        const find_credentials = (User.findOne({
            email: uname
        }), (err, results) => {
            if (err) {
                throw err
            }
            console.log(results.rows);
            // })

            if (results.rows.length > 0) {
                const user = results.rows[0];

                bcrypt.compare(password, user.pass, (err, isMatch) => {
                    if (err) {
                        console.log(err);
                    }

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: "Password is not correct"
                        });
                    }
                });
            } else {
                return done(null, false, {
                    message: "Email is not registered"
                });
            }

        });
    };

    passport.use(
        new LocalStrategy({
                usernameField: 'uname',
                passwordField: 'password'

            },
            authenticateUser
        )
    );

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((_id, done) => {
        // conn.query(
        //     `SELECT * FROM users WHERE id = $1 `, [id], (err, results) => {
        //         if (err) {
        //             return done(err);
        //         }
        //         return done(null, results.rows[0]);
        //     }
        // );
        const de_serialize = (User.findById({
            _id
        }), (err, results) => {
            if (err) {
                return done(err)
            }
            return done(null, results.rows[0])
        })
    });
}

module.exports = initialize;