var mongodb = require('./db');//�������ݿ�ģ��
        //User���캯�������ڴ�������
        function User(user) {
            this.name = user.name;
            this.password = user.password;
        };
        //User���󷽷������û���Ϣ����Mongodb
        User.prototype.save = function(callback){
            var user = { //�û���Ϣ
                name: this.name,
                password: this.password
            };
            // �����ݿ�
            mongodb.open(function(err, db) {
                if (err) {
                    return callback(err);
                }
                //��ȡusers���ϣ�users�൱�����ݿ��еı�
                db.collection('users', function(err, collection) {//���弯������users
                    if (err) {
                        mongodb.close();
                        return callback(err);
                    }
                    //��user�����е����ݣ����û�ע����Ϣд��users������
                    collection.insert(user, {safe: true}, function(err, user) {
                        mongodb.close();
                        callback(err, user);
                    });
                });
            })
        };
        //User���󷽷��������ݿ��в���ָ���û�����Ϣ
        User.get = function get(username, callback) {
            mongodb.open(function(err, db) {
                if (err) {
                    return callback(err);
                }
                //��ȡusers����
                db.collection('users', function(err, collection) {
                    if (err) {
                        mongodb.close();
                        return callback(err);
                    }
                    //��users�����в���name����Ϊusername�ļ�¼
                    collection.findOne({name: username}, function(err, doc) {
                        mongodb.close();
                        if (doc) {
                            //��װ��ѯ���ΪUser����
                            var user = new User(doc);
                            callback(err, user);
                        } else {
                            callback(err, null);
                        }
                    });
                });
            });
        };
         //���User����
         module.exports = User;