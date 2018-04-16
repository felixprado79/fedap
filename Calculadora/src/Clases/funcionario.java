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
public class funcionario extends persona {
    //variables
    public String numempleado;
    public String puesto;
    public String departamento;
    public ArrayList<Object> listaLibroFuncionario = new ArrayList<Object>();

    //constructor funcionario
    public funcionario(String p_nombre, String p_apellido, String p_correo, int p_telefono, String p_sede, String p_numempleado, String p_puesto, String p_departamento) {
        super(p_nombre, p_apellido, p_correo, p_telefono, p_sede);
        this.numempleado = p_numempleado;
        this.puesto = p_puesto;
        this.departamento = p_departamento;

    }

    //metodos gets sets
    public String getNumempleado() {
        return numempleado;
    }

    public void setNumempleado(String p_numempleado) {
        this.numempleado = p_numempleado;
    }

    public String getPuesto() {
        return puesto;
    }

    public void setPuesto(String p_puesto) {
        this.puesto = p_puesto;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String p_departamento) {
        this.departamento = p_departamento;
    }

    //muestra cuantos libros prestados tiene el funcionario
    @Override
    public void librosPrestados() {
        int cantidadPrestados = 0;

        Iterator<Object> li = listaLibroFuncionario.iterator();
        while (li.hasNext()) {
            li.next();
            cantidadPrestados++;
        }

        JOptionPane.showMessageDialog(null, "El usuario tiene " + cantidadPrestados + " libros prestados");
    }
}
