document.addEventListener('DOMContentLoaded', () => {
 	const formBuilder = document.getElementById('form-builder');
	const exportButton = document.getElementById('export-button');
    exportButton.addEventListener('click', exportForm);

	//Export Form Data
    function exportForm() {
        const formElements = formBuilder.querySelectorAll('.fb-input-field');
        const formData = [];

        formElements.forEach((elem, index) => {
            const type = elem.tagName.toLowerCase();
 
            const data = {
                order: index + 1,
                type: type,
                defaultValue: elem.value || '',
                label: elem.previousSibling.textContent || '',
                placeholder: elem.placeholder || '',
                maxFileSIze: elem.dataset.fileSize || 0,
                options: []
            };

            if (type === 'select') {
                const options = elem.querySelectorAll('option');
                options.forEach(option => {
                    data.options.push(option.textContent.trim());
                });
            }

            if (type === 'input' && elem.type === 'checkbox') {
                data.type = 'checkbox';
                data.value = elem.checked;
            }

            formData.push(data);
        });

        const jsonString = JSON.stringify(formData, null, 2);
        downloadJSON(jsonString);
    }


    function downloadJSON(jsonString) {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'form-data.json';
        a.click();
        URL.revokeObjectURL(url);
    }

});
