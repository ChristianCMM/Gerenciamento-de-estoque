function mascararTelefone(input) {
    let valor = input.value.replace(/\D/g, ''); // Remove tudo que não for número

    if (valor.length > 11) valor = valor.slice(0, 11); // Limita a 11 dígitos

    if (valor.length >= 2 && valor.length <= 6) {
    input.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    } else if (valor.length > 6) {
    input.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
    } else if (valor.length >= 1) {
    input.value = `(${valor}`;
    }
}