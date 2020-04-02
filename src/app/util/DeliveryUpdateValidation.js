class DeliveryUpdateValidation {
  TimeLimit(start_date, alterable, response) {
    if (start_date === true && alterable === true) {
      return response.json();
    }
    return console.log(
      response.json({
        message: 'Permitido retirar entregas apenas das 8h as 18h',
      })
    );
  }
}
export default new DeliveryUpdateValidation();
