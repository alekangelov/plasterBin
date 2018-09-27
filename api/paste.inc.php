<?php
    require_once('core.inc.php');


if (!isset($_POST['mode'])) {
    $mode = $_GET['mode'];
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
    }
} else {
    $mode = $_POST['mode'];
}

switch ($mode) {
    case 'paste':
        $db->query("SELECT * FROM pastes where id = $id");
        $res = $db->resultSet();
        echo json_encode($res);
        break;
    
    default:
        $jako = array();
        $jako.push('no perms');
        echo json_encode($jako);
        break;
}