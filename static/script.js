function validateForm() {
  var fileInput = document.getElementById('pc-upload-add');
  if (fileInput.value === '') {
    document.getElementById('error-message').innerHTML = 'No file selected.';
    return false;
  }
  return true;
}


function submitForm() {
  document.myForm.submit();
}




