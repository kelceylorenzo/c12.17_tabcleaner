const app = require('express')();
const PORT = process.env.PORT || 9000;

app.get('/', (req, res) => {
    res.send('<h1>App working!</h1>');
});

app.get('/test', (req, res) => {
    res.send('<h1>Test route hit</h1>');
});

app.listen(PORT, () => {
    console.log('Server running on PORT:' + PORT);
});
