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
public class autor extends persona {
    //variables
    public String nacionalidad;
    public boolean vivo;
    public int clibrosautor;

    //constructor autor
    public autor(String p_nombre, String p_apellido, String p_correo, int p_telefono, String p_sede, String p_nacionalidad, boolean p_vivo, int p_clibrosautor) {
        super(p_nombre, p_apellido, p_correo, p_telefono, p_sede);
        this.nacionalidad = p_nacionalidad;
        this.vivo = p_vivo;
        this.clibrosautor = p_clibrosautor;
    }

    //metodos gets y sets
    public String getNacionalidad() {
        return nacionalidad;
    }

    public void setNacionalidad(String p_nacionalidad) {
        this.nacionalidad = p_nacionalidad;
    }

    public boolean getVivo() {
        return vivo;
    }

    public void setVivo(boolean p_vivo) {
        this.vivo = p_vivo;
    }

    public int getClibrosautor() {
        return clibrosautor;
    }

    public void setClibrosautor(int p_clibrosautor) {
        this.clibrosautor = p_clibrosautor;
    }

    @Override
    public void librosPrestados() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
  
    

}
