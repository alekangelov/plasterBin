<?php
    use \Psr\Http\Message\ServerRequestInterface as Request;
    use \Psr\Http\Message\ResponseInterface as Response;

    require '../vendor/autoload.php';
    require '../src/conf/db.php';
    require '../src/pastes.php';

    $app->run();

