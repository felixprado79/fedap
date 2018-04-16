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
 * @author soporte
 */
public class profesor extends persona {
    //variables
    public int marca;
    public int ccurso;
    int libroprestadoProfesor = 0;
    public ArrayList<Object> listaLibroProfesor = new ArrayList<Object>();

    //constructor del profesor
    public profesor(String p_nombre, String p_apellido, String p_correo, int p_telefono, String p_sede, int p_marca, int p_ccurso) {
        super(p_nombre, p_apellido, p_correo, p_telefono, p_sede);
        this.marca = p_marca;
        this.ccurso = p_ccurso;
    }

    //metodos gets sets
    public int getMarca() {
        return marca;
    }

    public void setMarca(int p_marca) {
        this.marca = p_marca;
    }

    public int getCcurso() {
        return ccurso;
    }

    public void setCcurso(int p_ccurso) {
        this.ccurso = p_ccurso;
    }
//muestra cuantos libros prestados tiene el profesor
    @Override
    public void librosPrestados() {
        int cantidadPrestados = 0;

        Iterator<Object> li = listaLibroProfesor.iterator();
        while (li.hasNext()) {
            li.next();
            cantidadPrestados++;
        }

        JOptionPane.showMessageDialog(null, "El usuario tiene " + cantidadPrestados + " libros prestados");
    }

}
