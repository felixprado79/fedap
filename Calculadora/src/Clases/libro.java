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
public class libro {

    //variables
    public String nombrelibro;
    public String añopublicacion;
    public String editorial;
    public String autor;
    public int clibrosuniversidad;
    public int clibrosdisponibles;

    //identificacion a quien se lo prestó
    public libro(String p_nombrelibro, String p_anopublicacion, String p_editorial, String p_autor, int p_clibrosuniversidad, int p_clibrosdisponibles) {
        this.nombrelibro = p_nombrelibro;
        this.añopublicacion = p_anopublicacion;
        this.editorial = p_editorial;
        this.clibrosuniversidad = p_clibrosuniversidad;
        this.clibrosdisponibles = p_clibrosdisponibles;
        this.autor = p_autor;

    }
//gets sets

    public String getNombrelibro() {
        return nombrelibro;
    }

    public void setNombrelibro(String p_nombrelibro) {
        this.nombrelibro = p_nombrelibro;
    }

    public String getAñopublicacion() {
        return añopublicacion;
    }

    public void setAñopublicacion(String p_anopublicacion) {
        this.añopublicacion = p_anopublicacion;
    }

    public String getEditorial() {
        return editorial;
    }

    public void setEditorial(String p_editorial) {
        this.editorial = p_editorial;
    }

    public int getClibrosuniversidad() {
        return clibrosuniversidad;
    }

    public void setClibrosuniversidad(int p_clibrosuniversidad) {
        this.clibrosuniversidad = p_clibrosuniversidad;
    }

    public int getClibrosdisponibles() {
        return clibrosdisponibles;
    }

    public void setClibrosdisponibles(int p_clibrosdisponibles) {
        this.clibrosdisponibles = p_clibrosdisponibles;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

}
