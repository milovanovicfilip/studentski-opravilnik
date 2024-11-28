import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

router.get('/list', (req, res) => {
    res.render('list', { title: 'Seznam nalog' });
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

router.get('/kanban', (req, res) => {
    res.render('kanban', { title: 'Kanban' });
});

router.get('/calendar', (req, res) => {
    res.render('calendar', { title: 'Calendar' });
});

router.get('/settings', (req, res) => {
    res.render('settings', { title: 'Settings' });
});

router.get('/users-profile', (req, res) => {
    res.render('users-profile', { title: 'User Profile' });
});

export default router;
