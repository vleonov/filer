<?php

/**
 * @property string $id
 * @property string $huid
 * @property string $createdAt
 * @property string $finishAt
 */
class M_Upload extends Model
{

    protected $_idIsInt = false;
    protected $_tblName = 'uploads';

    public function save()
    {
        if (!$this->_id) {
            $this->_data['id'] = $this->_generateId();
            parent::save();
            $this->_id = $this->_data['id'];
            unset($this->_data['id']);
        } else {
            parent::save();
        }

        return $this->_id;
    }

    private function _generateId()
    {
        do {
            $id = '';
            for ($i = 0; $i<5; $i++) {
                $id .= chr(rand(97, 122));
            }
            $existed = new M_Upload($id);
        } while ($existed->id);

        return $id;
    }
}