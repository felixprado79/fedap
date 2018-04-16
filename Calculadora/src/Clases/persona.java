/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package clases;


/**
 *
 * @author SoportePixel
 */
public abstract class persona  {
    //variables
    private String nombre;
    private String apellido;
    private String correo;
    private int telefono;
    private String sede;
    
//constructor persona
    public persona(String p_nombre, String p_apellido, String p_correo, int p_telefono, String p_sede) {
        this.nombre = p_nombre;
        this.apellido = p_apellido;
        this.correo = p_correo;
        this.telefono = p_telefono;
        this.sede = p_sede;
    }
    
    //metodos gets sets
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String p_nombre) {
        this.nombre = p_nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String p_apellido) {
        this.apellido = p_apellido;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String p_correo) {
        this.correo = p_correo;
    }

    public int getTelefono() {
        return telefono;
    }

    public void setTelefono(int p_telefono) {
        this.telefono = p_telefono;
    }

    public String getSede() {
        return sede;
    }

    public void setSede(String p_sede) {
        this.sede = p_sede;
    }

    abstract public void librosPrestados();

   
   
    
}
