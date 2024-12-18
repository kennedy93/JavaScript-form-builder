document.addEventListener('DOMContentLoaded', () => {
    const formBuilder = document.getElementById('form-builder');
    const formElements = document.querySelectorAll('.form-element');
    
    const modal = document.getElementById('modal');
    const modalOverlay = document.getElementById('modal-overlay');

    // Modal Input Fields
    const labelInput = document.getElementById('label-input');
    const requiredInput = document.getElementById('is-required-input');
    const selectValuesInput = document.getElementById('select-values-input');
    const maxFilesizeInput = document.getElementById('max-filesize-input');
    const contentInput = document.getElementById('content-input');
    const blockTypeInput = document.getElementById('block-type-input');

    const saveButton = document.getElementById('save-button');

    let draggedElement = null;
    let currentElement = null;
    let placeholder = document.createElement('div');
    placeholder.className = 'placeholder';

    formElements.forEach(elem => {
        elem.addEventListener('dragstart', handleDragStart);
        elem.addEventListener('dragend', handleDragEnd);
    });

    formBuilder.addEventListener('dragover', handleDragOver);
    formBuilder.addEventListener('drop', handleDrop);
    //formBuilder.addEventListener('dblclick', handleDoubleClick);

    //Modal Event
    saveButton.addEventListener('click', saveChanges);

    function handleDragStart(e) {
        draggedElement = e.target;
        draggedElement.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.type);
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        if (placeholder) {
            placeholder.remove();
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if(draggedElement.classList.contains('form-group')) {
            draggedElement.classList.add('d-none');
        }

        const afterElement = getDragAfterElement(formBuilder, e.clientY);
        if (afterElement === null) {
            formBuilder.appendChild(placeholder);
        } else if (afterElement !== placeholder) {
            formBuilder.insertBefore(placeholder, afterElement);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain');

        if(draggedElement.classList.contains('form-group')) {
            draggedElement.classList.remove('d-none');
        }
 
        if (draggedElement && draggedElement.parentNode === formBuilder) {
            formBuilder.insertBefore(draggedElement, placeholder);
        } else {
            addFormElement(type, placeholder);
        }

        placeholder.remove();
        draggedElement = null;
    }

    function addFormElement(type, target) {
        // Create form group
        let formGroup = document.createElement("div");
        formGroup.className = "form-group";

        // Create label
        let label = document.createElement("label");
        label.className = 'control-label';

        switch (type) {
            case 'text':
                label.textContent = 'Text Input';
                var input = document.createElement("input");
                input.classList.add('form-control', 'fb-input-field');
                input.setAttribute("type", "text");
                input.setAttribute("placeholder", "Text Input");
                input.setAttribute("required", "true");
                break;
            case 'number':
                label.textContent = 'Number Input';
                var input = document.createElement("input");
                input.classList.add('form-control', 'fb-input-field');
                input.setAttribute("type", "number");
                input.setAttribute("placeholder", "Number Input");
                input.setAttribute("required", "true");
                break;    
            case 'textarea':
                label.textContent = 'Textarea';
                var input = document.createElement("textarea");
                input.classList.add('form-control', 'fb-input-field');
                input.setAttribute("placeholder", "Textarea");
                input.setAttribute("required", "true");
                break;
            case 'select':
                label.textContent = 'Select Box';
                var input = document.createElement("select");
                input.classList.add('form-control', 'fb-input-field');
                input.setAttribute("placeholder", "Select Box");
                input.setAttribute("required", "true");

                var options = ['Option 1', 'Option 2', 'Option 3'];

                options.forEach((element) => {
                    const option = document.createElement('option');
                    option.text = element;
                    input.add(option);
                });
                break;
            case 'file':
                label.textContent = 'File Upload';
                var input = document.createElement("input");
                input.classList.add('d-block', 'fb-input-field');
                input.setAttribute("type", "file");
                input.setAttribute("placeholder", "Select a file");
                input.setAttribute("required", "true");
                input.setAttribute("data-file-size", "2");
                break;
            case 'checkbox':
                label.textContent = 'Checkbox';
                var input = document.createElement("input");
                input.classList.add('d-block', 'fb-input-field');
                input.setAttribute("type", "checkbox");
                input.setAttribute("placeholder", "Checkbox");
                input.setAttribute("required", "true");
                break; 
            case 'paragraph':
                var input = document.createElement("p");
                input.classList.add('fb-input-field');
                input.innerText = 'Paragraph Text';
                break; 
        }

        //Create edit Button
        let editButtons = document.createElement("div");
        editButtons.className = "edit-buttons";

        // Create Edit Button
        let editButton = document.createElement("button");
        editButton.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'mr-1');
        editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        editButton.addEventListener('click', handleEditElement);
        editButtons.appendChild(editButton);

        // Create Delete Button
        let deleteButton = document.createElement("button");
        deleteButton.classList.add('btn', 'btn-outline-danger', 'btn-sm');
        deleteButton.innerHTML = '<i class="far fa-trash-alt"></i>';
        deleteButton.addEventListener('click', handleDeleteElement);
        editButtons.appendChild(deleteButton);
        
        formGroup.appendChild(editButtons);


        // Append label and input to form group
        if(type !== 'paragraph'){
            formGroup.appendChild(label);
        }
        formGroup.appendChild(input);

        if (formGroup) {
            formGroup.classList.add('form-element');
            
            formGroup.draggable = true;
            formGroup.addEventListener('dragstart', handleDragStart);
            formGroup.addEventListener('dragend', handleDragEnd);
            
            formBuilder.insertBefore(formGroup, target);
        }
    }


    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.form-element:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    /** Modify Elements **/
    function handleEditElement(e) {
        currentElement = e.target.closest('.form-element');

        //Display none to all fields
        labelInput.parentElement.parentElement.style.display = 'none'; 
        requiredInput.parentElement.parentElement.style.display = 'none';
        selectValuesInput.parentElement.parentElement.style.display = 'none';
        maxFilesizeInput.parentElement.parentElement.style.display = 'none';
        contentInput.parentElement.parentElement.style.display = 'none';
        blockTypeInput.parentElement.parentElement.style.display = 'none';

        const ignoreInputFields = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN'];

        if(ignoreInputFields.indexOf(currentElement.querySelector('.fb-input-field').nodeName) === -1) {
            labelInput.parentElement.parentElement.style.display = 'block';
            requiredInput.parentElement.parentElement.style.display = 'block';

            if (currentElement.querySelector('.fb-input-field').tagName.toLowerCase() === 'select') {
                selectValuesInput.parentElement.parentElement.style.display = 'block';
                let optionValues = [...currentElement.querySelector('.fb-input-field')?.options].map(o => o.value)
                selectValuesInput.value = optionValues.toString() || '';
            }

            if(currentElement.querySelector('.fb-input-field').type === 'file') {
                maxFilesizeInput.parentElement.parentElement.style.display = 'block';
                maxFilesizeInput.value = currentElement.querySelector('.fb-input-field').dataset.fileSize;
            }

            labelInput.value = currentElement.querySelector('.control-label')?.textContent || '';
            requiredInput.value = currentElement.querySelector('.fb-input-field')?.getAttribute('required') || '';
        }else{
            contentInput.parentElement.parentElement.style.display = 'block';
            blockTypeInput.parentElement.parentElement.style.display = 'block';
            
            contentInput.value = currentElement.querySelector('.fb-input-field')?.textContent || '';
            blockTypeInput.value = currentElement.querySelector('.fb-input-field')?.nodeName || '';
        }
        
        $('#elementModal').modal('show');
    }

    function handleDeleteElement(e){
        currentElement = e.target.closest('.form-element');
        currentElement.remove();
    }

    function saveChanges() {

        if (currentElement) {
            const ignoreInputFields = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN'];

            if(ignoreInputFields.indexOf(currentElement.querySelector('.fb-input-field').nodeName) === -1) {
                const newLabel = labelInput.value.trim();
                const newRequired = requiredInput.value.trim();


                currentElement.querySelector('.control-label').textContent = newLabel;
                currentElement.querySelector('.fb-input-field').placeholder = newLabel;
                currentElement.querySelector('.fb-input-field').setAttribute("required", newRequired);


                if (currentElement.querySelector('.fb-input-field').tagName.toLowerCase() === 'select') {
                    const newOptions = selectValuesInput.value.trim().split(',');
                    currentElement.querySelector('.fb-input-field').innerHTML = '';
                    newOptions.forEach((element) => {
                        const option = document.createElement('option');
                        option.text = element;
                        currentElement.querySelector('.fb-input-field').add(option);
                    });
                } 

                if(currentElement.querySelector('.fb-input-field').type === 'file') {
                    const newFilesize = maxFilesizeInput.value.trim();
                    currentElement.querySelector('.fb-input-field').dataset.fileSize = newFilesize;
                }
            }else{
                const newContent = contentInput.value.trim();
                const newBlockType = blockTypeInput.value.trim();

                var newElement = document.createElement(newBlockType);
                newElement.innerHTML = newContent;
                newElement.classList.add('fb-input-field');
                currentElement.querySelector('.fb-input-field').replaceWith(newElement);
            }
            
            $('#elementModal').modal('hide');
        }
    }
    
});
