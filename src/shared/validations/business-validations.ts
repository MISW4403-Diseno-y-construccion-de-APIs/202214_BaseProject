export function esPaisPermitido(pais: string): boolean{
    let paisesPermitidos : string[] = ['Argentina', 'Ecuador', 'Paraguay'];
    if (paisesPermitidos.includes(pais))
        return true;
    return false;
}

export function tieneLongitudRequerida(nombreSupermercado: string): boolean{
    let longitudNombreSupermercado : number = nombreSupermercado.length;
    if (longitudNombreSupermercado > 10)
        return true;
    return false;
}