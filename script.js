async function callEndpoint(itemId, name, color, harga, pengirim, kota, rintisan, img1, img2, img3) {
    const url = 'https://qlpav7.buildship.run/untitledFlow-2b2016a16bb1';
    const data = {
        itemId: itemId,
name: name,
color: color,
harga: harga,
pengirim: pengirim,
kota: kota,
rintisan: rintisan,
img1: img1,
img2: img2,
img3: img3
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
