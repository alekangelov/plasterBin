<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;


$app = new \Slim\App;

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
            ->withHeader('Access-Control-Allow-Origin', 'http://plasterbin.alekangelov.com')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

//get all pastes
$app->get('/pastes/', function (Request $request, Response $response) {
    $sql = "SELECT * FROM pastes";
    try {
        $db = new Database();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $pastes = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($pastes);
    } catch(PDOException $e) {
        print_r($e);
    }
    return $response;
});

//get single paste
$app->get('/pastes/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $sql = "SELECT * FROM pastes WHERE `unique_id` = '$id'";
    try {
        $db = new Database();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $pastes = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($pastes);
    } catch(PDOException $e) {
        print_r($e);
    }
    return $response;
});

//add paste
$app->post('/pastes/add/', function ($request, $response, $args) {
    $content = $request->getParam('content');
    $id = uniqid();
    $sql = "INSERT INTO pastes (content, unique_id) VALUES(:content, :id)";
    try {
        $db = new Database();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        echo $id;
        $db = null;
    } catch(PDOException $e) {
        print_r($e);
    }
    return $response;
});

$app->put('/pastes/update/{id}', function ($request, $response) {
    $content = $request->getParam('content');
    $id = $request->getAttribute('id');
    $sql = "UPDATE pastes SET content = :content WHERE unique_id = :id";
    try {
        $db = new Database();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        echo $id;
        $db = null;
    } catch(PDOException $e) {
        print_r($e);
    }
    return $response;
});

$app->delete('/pastes/delete/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $sql = "DELETE FROM pastes where unique_id = :id";
    try {
        $db = new Database();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $db = null;
    } catch(PDOException $e) {
        print_r($e);
    }
    return $response;
});

$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function($req, $res) {
    $handler = $this->notFoundHandler; // handle using the default Slim page not found handler
    return $handler($req, $res);
});