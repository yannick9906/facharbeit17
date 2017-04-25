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
    require_once '../../classes/Order.php';
    require_once '../../classes/FilamentType.php';

    $user = \print3d\User::checkSession();
    $pdo = new \print3d\PDO_Mysql();

    $filaments = ["success" => true];
    if($_GET["type"] == "active") $filaments["filaments"] = \print3d\FilamentType::getAllAvailableFilaments();
    else if($_GET["type"] == "all") $filaments["filaments"] = \print3d\FilamentType::getAllFilaments();
    echo json_encode($filaments);