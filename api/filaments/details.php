<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-04-25
     * Time: 02:13 AM
     */

    ini_set("display_errors", "on");
    error_reporting(E_ALL & ~E_NOTICE);

    require_once '../../classes/PDO_Mysql.php'; //DB Anbindung
    require_once '../../classes/User.php';
    require_once '../../classes/Util.php';
    require_once '../../classes/FilamentType.php';

    $user = \print3d\User::checkSession();
    $pdo = new \print3d\PDO_Mysql();

    //User ID 0 == current user, so current user is sent.
    $fID = intval($_GET["id"]);
    if($fID == 0) echo json_encode($user);
    else {
        //Else send Data from requested user
        $filamentToView = \print3d\FilamentType::fromFID($fID);
        if($filamentToView->getColorcode() != null)
            echo json_encode($filamentToView);
        else
            //Or fail...
            echo json_encode(["error" => "ID unknown"]);
    }