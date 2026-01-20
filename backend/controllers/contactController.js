const { Contact } = require('../models');

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts' });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        await Contact.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact' });
    }
};
