// Importando schema/model criado no arquivo
const Team = require('../models/team');

exports.showList = (req, res) => {
    // find() = realiza uma query no mongoDB procurando a partir do parametro colocado ou tudo caso esteja vazio
    // O parametro {} é necessário pois não podemos deixar o campo vazio quando temos mais parametros sendo utilizados
    Team.find({}, (err, teams) => {
        if(err){
            res.status(500).send({error: "Request error!"});
        }
        // Retorna todos os registros em formato JSON
        res.status(200).json(teams);
    });
}

exports.findById = (req, res) => {
    // Utiliza o ID enviado na URI
    const id = req.params.id;
    Team.findById(id, (err, team) => {
        if(err){
            res.status(500).send({error: "Request error!"});
        }
        // Caso tenha achado a equipe (if team == true)
        if(team){
            res.status(200).json(team);
        }
        else{
            res.status(404).json({error: "Team not found"});
        }
    });
}

exports.create = (req, res) => {
    // Cria uma instância de Team utilizando os parametros do Body da requisição
    let newTeam = new Team(req.body);
    if(!newTeam || !newTeam.fullName || !newTeam.nationality || !newTeam.firstYearEntry){
        res.status(400).send({error: "JSON parameters cannot be Null or Empty"});
    }
    else{
        // Usando função save() do mongoDB para confirmar a inserção dos dados no banco
        newTeam.save((err, team) => {
            if(err){
                res.status(500).send({error: "Request error!"});
            }
            res.status(201).json(team);
        });
    }
}

exports.update = (req, res) => {
    const id = req.params.id;
    const teamUpdate = req.body;
    if(!teamUpdate || !teamUpdate.fullName || !teamUpdate.nationality || !teamUpdate.firstYearEntry){
        res.status(400).send({error: "JSON parameters cannot be Null or Empty"});
    }
    // {new:true} -> Esta opção faz com que o retorno da API mostre o valor atualizado e não o antigo que já consta no DB
    Team.findByIdAndUpdate(id, teamUpdate, {new: true}, (err, updatedTeam) => {
        if(err){
            res.status(500).send({error: "Request error!"});
        }
        if(updatedTeam){
            res.status(200).json(updatedTeam);
        }
        else{
            res.status(404).json({error: "Team not found"});
        }
    });
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Team.findByIdAndDelete(id, (err, teamDeleted) => {
        if(err){
            res.status(500).send({error: "Request error!"});
        }
        if(teamDeleted){
            //res.json(teamDeleted);
            res.status(200).json("TEAM REMOVED!");
        }
        else{
            res.status(404).json({error: "Team not found"});
        }
    });
}

/* exports.search = (req, res) => {
    // Verifica se existe query na URI e se tem o parametro "nome" nela
    if(req.query && req.query.name){
        const paramName = req.query.name;
        Team.find({fullName: paramName}, (err, teams) => {
            if(err){
                res.status(500).send(err);
            }
            // Como vai retornar um Array, devemos verificar se a quantidade de elementos é maior que zero também
            if(teams && teams.length > 0){
                res.json(teams);
            }
            else{
                res.status(404).json({error: "Team not found"});
            }
        });
    }
    else{
        res.status(400).send({error: "Parameter 'name' is required"});
    }
}; */
