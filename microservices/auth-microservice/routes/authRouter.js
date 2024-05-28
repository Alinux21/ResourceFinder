app.get('/login',(req,res)=>{
    req.session.username='fahad';
    res.send('<h4>Logged in successfully</h4>');
    });