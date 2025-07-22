async function callEndpoint(img1) {
    const url = 'https://qlpav7.buildship.run/untitledFlow-2b2016a16bb1';
    const data = {
        img1: img1
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('Success:', result);
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}
