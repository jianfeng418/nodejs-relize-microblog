var settings = require('../settings'), //���ر������ݿ������Ϣ��ģ��
   Db = require('mongodb').Db,       //����MongDB���ݿ�����ģ�飬��������ض���
   Server = require('mongodb').Server;

   //�������ݿ����ơ����ݿ��ַ�����ݿ�Ĭ�϶˿ںŴ���һ�����ݿ�ʵ����Ȼ��ͨ��module.exports������������ݿ�����
   module.exports = new Db(settings.db, new Server(settings.host,27017),{safe: true});
   //mongodb���ݿ��������Ĭ�϶˿ں�:27017