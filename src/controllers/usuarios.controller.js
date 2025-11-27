
async function testarRota(req, res){

    res.status(200).json({
        msg: 'rota de usuarios funcionando!'
    });
}



module.exports = { testarRota};