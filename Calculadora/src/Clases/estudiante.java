/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package clases;

import java.util.ArrayList;
import java.util.Iterator;
import javax.swing.JOptionPane;

/**
 *
 * @author SoportePixel
 */
public class estudiante extends persona {
    //variables
    private String carnet;
    private String carrera;
    private Boolean activo;
    public ArrayList<Object> listaLibroEstudiante = new ArrayList<Object>();

    //constructor estudiante
    public estudiante(String p_carnet, String p_carrera, Boolean p_activo, String p_nombre, String p_apellido, String p_correo, int p_telefono, String p_sede) {
        super(p_nombre, p_apellido, p_correo, p_telefono, p_sede);
        this.carnet = p_carnet;
        this.carrera = p_carrera;
        this.activo = p_activo;
    }

    //metodos gets sets
    public String getCarnet() {
        return carnet;
    }

    public void setCarnet(String p_carnet) {
        this.carnet = p_carnet;
    }

    public String getCarrera() {
        return carrera;
    }

    public void setCarrera(String p_carrera) {
        this.carrera = p_carrera;
    }

    public boolean getActivo() {
        return activo;
    }

    public void setActivo(boolean p_activo) {
        this.activo = p_activo;
    }

    //muestra cuantos libros prestados tiene el estudiante
    @Override
    public void librosPrestados() {
        int cantidadPrestados = 0;

        Iterator<Object> li = listaLibroEstudiante.iterator();
        while (li.hasNext()) {
            li.next();
            cantidadPrestados++;
        }

        JOptionPane.showMessageDialog(null, "El usuario tiene " + cantidadPrestados + " libros prestados");
    }
}
