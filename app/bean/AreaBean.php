<?php

class AreaBean {
    public $codArea;
    public $nombArea;
    public $tipoArea;
    public $pabellonArea;
    public $piso;
    public $aforo;
    public $notas;
    public $estado;

    //Getter
    public function getCodArea() {
        return $this->codArea;
    }

    public function getNombArea() {
        return $this->nombArea;
    }

    public function getTipoArea() {
        return $this->tipoArea;
    }

    public function getPabellonArea() {
        return $this->pabellonArea;
    }

    public function getPiso() {
        return $this->piso;
    }

    public function getAforo() {
        return $this->aforo;
    }

    public function getNotas() {
        return $this->notas;
    }

    public function getEstado() {
        return $this->estado;
    }


    //Setter
    public function setCodArea($codArea) {
        $this->codArea = $codArea;
    }

    public function setNombArea($nombArea) {
        $this->nombArea = $nombArea;
    }

    public function setTipoArea($tipoArea) {
        $this->tipoArea = $tipoArea;
    }

    public function setPabellonArea($pabellonArea) {
        $this->pabellonArea = $pabellonArea;
    }

    public function setPiso($piso) {
        $this->piso = $piso;
    }

    public function setAforo($aforo) {
        $this->aforo = $aforo;
    }

    public function setNotas($notas) {
        $this->notas = $notas;
    }

    public function setEstado($estado) {
        $this->estado = $estado;
    }
}
?>

