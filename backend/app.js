const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const app = express();


const adminUser = {
    id: 1,
    email: 'admin@admin.com',
    password: 'admin123',
    role: 'admin'
};


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
    (email, password, done) => {
        
        if (email === adminUser.email && password === adminUser.password) {
            return done(null, adminUser);
        }
        return done(null, false, { message: 'Feil e-post eller passord' });
    }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
   
    if (id === adminUser.id) {
        done(null, adminUser);
    } else {
        done(null, false);
    }
});


app.post('/admin/login', passport.authenticate('local', {
    successRedirect: '/admin/login/success',
    failureRedirect: '/admin/login/failure',
    failureFlash: false
}));


app.get('/admin/login/success', (req, res) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        res.send('Du har logget inn som admin!');
    } else {
        res.status(403).send('Ingen tilgang');
    }
});


app.get('/admin/login/failure', (req, res) => {
    res.send('Feil e-post eller passord');
});


app.post('/admin/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Feil ved utlogging' });
        }
        res.send('Du har logget ut');
    });
});


app.listen(3000, () => {
    console.log('Serveren kjører på port 3000');
});
